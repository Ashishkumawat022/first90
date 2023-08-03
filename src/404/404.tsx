import * as React from "react";
import { Card, Dropdown, Row, Col } from "react-bootstrap";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";
import cx from "../admin.style.module.scss";
import ex from "./404.module.scss";

export default function Error404() {
  return (
    <>
      <Header title="Coming Soon" />
      <Sidebar />
      <section className={`${cx.pageWrapper}`}>
        <Card>
          <Card.Body>
            <Card.Text>
              <div className={`${ex.errorBox}`}>
                <h1>COMING SOON</h1>
                <p>This Page is under construction</p>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </section>
      <Footer />
    </>
  );
}
