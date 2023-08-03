import * as React from "react";
import Box from "@mui/material/Box";
import { Card, Dropdown, Row, Col } from "react-bootstrap";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";
import cx from "../admin.style.module.scss";
import ex from "./ErrorPage.module.scss";

export default function ErrorPage() {
  return (
    <>
      <section>
        <Card>
          <Card.Body>
            <Card.Text>
              <div className={`${ex.errorBox}`}>
                <h1>OOP'S NO Page is Available</h1>
                <p>You have to take another route </p>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}
