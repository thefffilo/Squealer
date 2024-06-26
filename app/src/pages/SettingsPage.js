import "../css/SettingsPage.css";
import theme from "../config/theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Card, Button, Tab, Nav, Accordion } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";

import TopBar from "../components/TopBar";
import DeleteModal from "../components/settings/DeleteModal";
import AccountPane from "../components/settings/AccountPane";
import EditAccountPane from "../components/settings/EditAccount";

import ShopPane from "../components/settings/ShopPane";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../config/config";

function SettingsPage() {
  const axiosInstance = useAxiosPrivate();
  const endpoint = config.endpoint.users + "/";
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [user, setUser] = useState({});

  const [activetab, setActivetab] = useState("Il mio account");
  const [clickedToggle, setClickedToggle] = useState(false);

  const [showdelete, setShowDelete] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userid");

    axiosInstance
      .get(endpoint + userId)
      .then((res) => {
        console.log(res.data);

        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axiosInstance, endpoint]);

  function handleCheckDelete() {
    setShowDelete(true);
  }

  function handleDelete() {
    const userId = sessionStorage.getItem("userid");

    axiosInstance
      .delete(endpoint + userId)
      .then((res) => {
        // console.log(res.data);
        sessionStorage.clear();
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSProfessional() {
    axiosInstance
      .patch(endpoint + sessionStorage.getItem("userid") + "/professional")
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="sticky-top">
        <TopBar />

        <DeleteModal
          show={showdelete}
          onHide={() => setShowDelete(false)}
          handleDelete={handleDelete}
        />
        {isMobile && (
          <div
            className="d-flex justify-content-center align-items-center py-2"
            style={{
              backgroundColor: "white",
            }}
          >
            <Button
              variant="outline-danger"
              onClick={() => setClickedToggle(!clickedToggle)}
              style={{
                borderRadius: "20px",
                backgroundColor: theme.colors.transparent,
                color: theme.colors.dark,
                border: "none",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
              tabIndex={0}
              aria-label="Sezione attualmente aperta"
            >
              {activetab} <ChevronDown size={"2vh"} />
            </Button>
          </div>
        )}
      </div>

      <div className={isMobile ? "" : "row"}>
        <Tab.Container defaultActiveKey="first">
          <div className={isMobile ? "" : "row container-fluid"}>
            {isMobile ? (
              <>
                <Accordion activeKey={clickedToggle && "0"}>
                  <Accordion.Item
                    eventKey="0"
                    style={{
                      border: "none",
                    }}
                  >
                    <Accordion.Body>
                      <Nav
                        variant="pills"
                        className="flex-column p-5"
                        aria-label="Navigazione impostazioni account"
                      >
                        <Nav.Item tabIndex={0}>
                          <Nav.Link
                            eventKey="first"
                            onClick={() => setActivetab("Il mio profilo")}
                          >
                            Il mio profilo
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item tabIndex={0}>
                          <Nav.Link
                            eventKey="second"
                            onClick={() => setActivetab("Modifica account")}
                          >
                            Modifica account
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item tabIndex={0}>
                          <Nav.Link
                            eventKey="third"
                            onClick={() => setActivetab("Negozio squeal")}
                          >
                            Negozio squeal
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item tabIndex={0}>
                          <Nav.Link
                            eventKey="fourth"
                            onClick={() =>
                              setActivetab("Squealer Professional")
                            }
                            className="passaprofessional"
                          >
                            Passa a Squealer Professional
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="d-flex justify-content-center align-items-end pt-5">
                          <Button
                            variant="outline-danger"
                            onClick={handleCheckDelete}
                          >
                            Elimina account
                          </Button>
                        </Nav.Item>
                      </Nav>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            ) : (
              <div className="col-md-3">
                <h1
                  className="text-center pt-5 px-3"
                  tabIndex={0}
                  aria-label="Sezione attualmente aperta"
                >
                  {" "}
                  {activetab}
                </h1>
                <Nav variant="pills" className="flex-column p-5">
                  <Nav.Item tabIndex={0}>
                    <Nav.Link
                      eventKey="first"
                      onClick={() => setActivetab("Il mio profilo")}
                    >
                      Il mio profilo
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex={0}>
                    <Nav.Link
                      eventKey="second"
                      onClick={() => setActivetab("Modifica account")}
                    >
                      Modifica account
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex={0}>
                    <Nav.Link
                      eventKey="third"
                      onClick={() => setActivetab("Negozio squeal")}
                    >
                      Negozio squeal
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex={0}>
                    <Nav.Link
                      eventKey="fourth"
                      onClick={() => setActivetab("Squealer Professional")}
                      className="passaprofessional"
                    >
                      Passa a Squealer Professional
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="d-flex justify-content-center align-items-end pt-5">
                    <Button
                      variant="outline-danger"
                      onClick={handleCheckDelete}
                    >
                      Elimina account
                    </Button>
                  </Nav.Item>
                </Nav>
              </div>
            )}

            <div className="col">
              <Tab.Content
                style={{
                  borderRadius: "20px",
                  backgroundColor: theme.colors.transparent,
                  height: "100%",
                }}
              >
                <Tab.Pane eventKey="first">
                  <div className="container-fluid">
                    <AccountPane user={user} />
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <EditAccountPane />
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <ShopPane user={user} />
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                  <div
                    className={
                      isMobile
                        ? "p-4"
                        : "d-flex justify-content-center align-items-center p-5"
                    }
                  >
                    <Card style={{ borderRadius: "2vh" }}>
                      <Card.Body>
                        <Card.Title className="p-3 text-center " tabIndex={0}>
                          Squealer Professional
                        </Card.Title>

                        <Card.Text className="pe-none" tabIndex={0}>
                          Squealer Professional è un abbonamento che ti permette
                          di avere accesso a funzionalità esclusive, come
                          caratteri aggiuntivi, canali personalizzati e la
                          possibilità di avere un Social Media Manager.
                        </Card.Text>

                        <Card.Text className="pe-none" tabIndex={0}>
                          L'abbonamento costa 9,99€ al mese.
                        </Card.Text>

                        {user.professional ? (
                          <div
                            className="text-center"
                            style={{
                              color: theme.colors.success,
                              fontWeight: "bold",
                              fontSize: "1.3rem",
                            }}
                            tabIndex={0}
                          >
                            Sei già uno Squealer Professional!
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            className="mx-auto d-block"
                            onClick={handleSProfessional}
                          >
                            Attiva
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    </>
  );
}

export default SettingsPage;
