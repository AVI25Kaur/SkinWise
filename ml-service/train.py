
import json
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras import layers, models


BASE = Path(__file__).resolve().parent

DATA = Path(
    r"C:\Users\amrit\.cache\kagglehub\datasets\kmader\skin-cancer-mnist-ham10000\versions\2"
)

CSV = DATA / "HAM10000_metadata.csv"

IMAGE_DIRS = [
    DATA / "HAM10000_images_part_1",
    DATA / "HAM10000_images_part_2",
]

OUT = BASE / "models"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42

CLASS_NAMES = {
    "akiec": "Actinic keratoses / intraepithelial carcinoma",
    "bcc": "Basal cell carcinoma",
    "bkl": "Benign keratosis-like lesions",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic nevi",
    "vasc": "Vascular lesions",
}


def main():

    if not CSV.exists():
        raise SystemExit(f"Metadata CSV not found: {CSV}")

    # Find images in both dataset folders.
    print("Scanning HAM10000 image folders...")

    image_lookup = {}

    for image_dir in IMAGE_DIRS:
        if image_dir.exists():
            for image_path in image_dir.glob("*.jpg"):
                image_lookup[image_path.stem] = str(image_path)

    df = pd.read_csv(CSV)

    df["path"] = df["image_id"].map(image_lookup)

    df = df[
        df["path"].notna() & df["dx"].isin(CLASS_NAMES)
    ].copy()

    print(f"Matched images: {len(df)}")
    print("\nImages per category:")
    print(df["dx"].value_counts())

    if df.empty:
        raise SystemExit(
            "No matching images found. Check the dataset folders."
        )

    # Create training and validation sets.
    train_df, val_df = train_test_split(
        df,
        test_size=0.2,
        random_state=SEED,
        stratify=df["dx"],
    )

    labels = sorted(CLASS_NAMES.keys())

    label_to_index = {
        label: index for index, label in enumerate(labels)
    }

    print(f"\nTraining images: {len(train_df)}")
    print(f"Validation images: {len(val_df)}")
    print("\nLoading EfficientNetB0...")

    def make_dataset(frame, training):

        paths = frame["path"].values

        y = frame["dx"].map(label_to_index).values.astype("int32")

        ds = tf.data.Dataset.from_tensor_slices((paths, y))

        def load(path, label):

            image = tf.io.read_file(path)

            image = tf.image.decode_jpeg(
                image,
                channels=3,
            )

            image = tf.image.resize(
                image,
                IMG_SIZE,
            )

            image = tf.keras.applications.efficientnet.preprocess_input(
                image
            )

            return image, tf.one_hot(
                label,
                len(labels),
            )

        ds = ds.map(
            load,
            num_parallel_calls=tf.data.AUTOTUNE,
        )

        if training:
            ds = ds.shuffle(
                min(len(frame), 3000),
                seed=SEED,
            )

            ds = ds.map(
                lambda x, y: (
                    tf.image.random_flip_left_right(x),
                    y,
                ),
                num_parallel_calls=tf.data.AUTOTUNE,
            )

        return ds.batch(BATCH_SIZE).prefetch(
            tf.data.AUTOTUNE
        )

    weights = compute_class_weight(
        class_weight="balanced",
        classes=np.array(labels),
        y=train_df["dx"].values,
    )

    class_weights = {
        index: float(weight)
        for index, weight in enumerate(weights)
    }

    train_ds = make_dataset(train_df, True)
    val_ds = make_dataset(val_df, False)

    # Use pretrained EfficientNetB0.
    backbone = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(*IMG_SIZE, 3),
    )

    backbone.trainable = False

    inputs = layers.Input(
        shape=(*IMG_SIZE, 3)
    )

    x = backbone(
        inputs,
        training=False,
    )

    x = layers.GlobalAveragePooling2D()(x)

    x = layers.Dropout(0.3)(x)

    outputs = layers.Dense(
        len(labels),
        activation="softmax",
    )(x)

    model = models.Model(
        inputs,
        outputs,
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=1e-3
        ),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    OUT.mkdir(
        parents=True,
        exist_ok=True,
    )

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            patience=3,
            restore_best_weights=True,
            monitor="val_loss",
        ),
        tf.keras.callbacks.ModelCheckpoint(
            str(OUT / "skinwise_ham10000.keras"),
            save_best_only=True,
            monitor="val_loss",
        ),
    ]

    print("\nStarting model training...\n")

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=12,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    # Save the class labels and model metadata.
    with open(
        OUT / "labels.json",
        "w",
        encoding="utf-8",
    ) as f:

        json.dump(
            {
                "labels": labels,
                "class_names": CLASS_NAMES,
                "image_size": list(IMG_SIZE),
                "dataset": "HAM10000",
            },
            f,
            indent=2,
        )

    print("\nTraining finished successfully.")
    print(f"Model and labels saved in: {OUT}")
    print(
        "Important: This is an experimental research prototype, "
        "not a clinical diagnostic tool."
    )


if __name__ == "__main__":
    main()
