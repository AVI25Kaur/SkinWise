
import React from "react";
import "./css/main.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/screens/helpers/ProtectedRoute";

import Landing from "./components/screens/Landing";
import Home from "./components/screens/Home";
import About from "./components/screens/About";

import Navbar from "./components/screens/helpers/Navbar";

import InfoFrame from "./components/screens/disease-info/cancer/InfoFrame";
import { data } from "./components/screens/disease-info/cancer/data";

import { diseaseData } from "./components/screens/disease-info/disease/diseaseData";
import DiseaseInfoFrame from "./components/screens/disease-info/disease/DiseaseInfoFrame";

import AllInfo from "./components/screens/AllInfo";
import FindDermatologist from "./components/screens/findDerma/FindDermatologist";

import GetTested from "./components/screens/getTesed/GetTested";
import SkinAI from "./components/screens/SkinAI";

import Blog from "./components/screens/blog/Blog";
import BlogPost from "./components/screens/blog/BlogPost";

import Login from "./components/screens/auth/Login";
import Signup from "./components/screens/auth/Signup";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar />

          <div className="padded-content">
            <Switch>

              {/* Public Routes */}

              <Route exact path="/" component={Landing} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />


              {/* Protected Application Routes */}

              <ProtectedRoute exact path="/home" component={Home} />

              <ProtectedRoute exact path="/info" component={AllInfo} />

              <ProtectedRoute exact path="/blog" component={Blog} />

              <ProtectedRoute exact path="/blog/:id" component={BlogPost} />

              <ProtectedRoute
                exact
                path="/get-tested"
                component={GetTested}
              />

              <ProtectedRoute
                exact
                path="/ai-skin-check"
                component={SkinAI}
              />

              <ProtectedRoute
                exact
                path="/find-a-dermatologist"
                component={FindDermatologist}
              />


              {/* Protected Cancer Information Routes */}

              <ProtectedRoute
                exact
                path="/info/actinic-keratosis"
                render={() => <InfoFrame data={data[0]} />}
              />

              <ProtectedRoute
                exact
                path="/info/basal-cell-carcinoma"
                render={() => <InfoFrame data={data[1]} />}
              />

              <ProtectedRoute
                exact
                path="/info/melanoma"
                render={() => <InfoFrame data={data[2]} />}
              />

              <ProtectedRoute
                exact
                path="/info/merkel-cell-carcinoma"
                render={() => <InfoFrame data={data[3]} />}
              />

              <ProtectedRoute
                exact
                path="/info/squamous-cell-carcinoma"
                render={() => <InfoFrame data={data[4]} />}
              />


              {/* Protected Disease Information Routes */}

              {diseaseData.map((disease, index) => (
                <ProtectedRoute
                  exact
                  path={disease.route}
                  render={() => <DiseaseInfoFrame data={disease} />}
                  key={index}
                />
              ))}

            </Switch>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
