

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { data } from "./disease-info/cancer/data";
import { diseaseData } from "./disease-info/disease/diseaseData";

const AllInfo = () => {
  const [skinCancerData, setSkinCancerData] = useState([]);
  const [skinDiseaseData, setSkinDiseaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const getAllUrls = useCallback(() => {
    setSkinCancerData(
      data.map((doc) => ({
        title: doc.cancerType,
        route: doc.route,
      }))
    );

    setSkinDiseaseData(
      diseaseData.map((doc) => ({
        title: doc.skintype,
        route: doc.route,
      }))
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    getAllUrls();
  }, [getAllUrls]);

  const category = ["Skin Cancer", "Skin Diseases"];

  const activeData =
    tabIndex === 0 ? skinCancerData : skinDiseaseData;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="all-info">
      <div className="header">
        <div className="title">
          <div className="side-line"></div>
          <h3>Skin Cancer Information</h3>
        </div>

        <div className="middle-section my-3">
          <div
            className="tabs"
            role="tablist"
            aria-label="Skin information categories"
          >
            {category.map((cat, index) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={tabIndex === index}
                className={`tab p-1 ${
                  tabIndex === index ? "selected" : ""
                }`}
                onClick={() => setTabIndex(index)}
              >
                <h3 className="fw-n">{cat}</h3>
              </button>
            ))}
          </div>

          <div className="cards">
            {activeData.map((item, index) => (
              <Link
                to={item.route}
                className="my-1 p-1"
                key={`${item.route}-${index}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInfo;
