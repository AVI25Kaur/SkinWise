import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
                fontSize: "1.1rem",
                color: "#ff2e63",
              }}
            >
              <i className="fas fa-spinner fa-spin" style={{ marginRight: "0.5rem" }}></i>
              Verifying session...
            </div>
          );
        }

        if (isAuthenticated) {
          if (Component) {
            return <Component {...props} />;
          }
          if (render) {
            return render(props);
          }
          return null;
        }

        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
