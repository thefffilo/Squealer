import theme from "../config/theme";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Search,
  Avatar,
  Conversation,
  ConversationList,
  ConversationHeader,
  Loader,
} from "@chatscope/chat-ui-kit-react";

import { Signpost } from "react-bootstrap-icons";

import AttachPreview from "./SquealBox/AttachPreview";

import { useMediaQuery } from "react-responsive";

import guesticon from "../assets/guesticon.png";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../config/config";
import { Button } from "react-bootstrap";
import Geolocation from "./posts/Geolocation";

function ChatUI({ myself }) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const axiosInstance = useAxiosPrivate();

  // Conversations variables
  const [activeconversation, setActiveConversation] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [conversationslist, setConversationslist] = useState([]);
  const [searchedconversations, setSearchedConversations] = useState([]);

  // Messages variables
  const [messages, setMessages] = useState([]);
  const [contentType, setContentType] = useState("text"); // ["text", "file", "location"]
  const fileInputRef = useRef(null);
  const [mfile, setMfile] = useState(null);
  const [squeallocation, setSqueallocation] = useState(null);

  // UI variables
  const [showsidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      axiosInstance
        .get(
          config.endpoint.users +
            "/" +
            sessionStorage.getItem("userid") +
            "/conversations"
        )
        .then((res) => {
          // Check if in the response there are conversations
          if (res.status === 204) {
            return;
          }

          // Remove myself from the list of users and keep the data of the other user, rename the field to only have user2 in the name
          res.data = res.data.map((convo) => {
            if (convo.user1._id === myself._id) {
              delete convo.user1;
            } else {
              convo.user2 = convo.user1;
              delete convo.user1;
            }
            return convo;
          });

          setConversationslist(res.data);
          setSearchedConversations(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // When activeconversation is set, add an interval to constantly fetch the messages for the conversation
    if (activeconversation._id) {
      const interval = setInterval(() => {
        // console.log("Fetching messages for conversation: ", activeconversation);
        axiosInstance
          .get(
            config.endpoint.users +
              "/" +
              sessionStorage.getItem("userid") +
              "/conversations/" +
              activeconversation._id
          )
          .then((res) => {
            // Check if in the response there are messages
            // console.log(res.data);
            if (res.status === 204) {
              setMessages([]);
              return;
            }
            setMessages(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeconversation]);

  function handleSendMessage() {
    console.log("Sending message");
    const event = inputValue;
    // if (event === "" && !mfile) return;
    setInputValue("");

    // Check if the message is a file or a text
    if (contentType === "geolocalization") {
      // Send the squeal with the location

      axiosInstance
        .post(
          config.endpoint.users +
            "/" +
            sessionStorage.getItem("userid") +
            "/conversations/" +
            activeconversation._id,
          {
            content: squeallocation,
            contentType: "geolocalization",
          }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if ((contentType === "image" || contentType === "video") && mfile) {
      // Send the squeal with the file
      console.log("Sending file");
      const formData = new FormData();
      formData.append("message", mfile);
      formData.append("contentType", contentType);
      axiosInstance
        .post(
          config.endpoint.users +
            "/" +
            sessionStorage.getItem("userid") +
            "/conversations/" +
            activeconversation._id,
          formData
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (contentType === "text") {
      axiosInstance
        .post(
          config.endpoint.users +
            "/" +
            sessionStorage.getItem("userid") +
            "/conversations/" +
            activeconversation._id,
          {
            content: event,
            contentType: "text",
          }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // Reset the message input
    setMfile(null);
    setContentType("text");
  }

  function handleCovoChange(cname) {
    setActiveConversation(cname);
    console.log(cname);

    // fetch dei messaggi della conversazione cambiata
    axiosInstance
      .get(
        config.endpoint.users +
          "/" +
          sessionStorage.getItem("userid") +
          "/conversations/" +
          cname._id
      )
      .then((res) => {
        // Check if in the response there are messages

        console.log(res.data);
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSearch(event) {
    // fetch dei messaggi della conversazione cambiata

    if (event === "") {
      setSearchedConversations(conversationslist);
      return;
    }

    const filteredconvos = conversationslist.filter((convo) => {
      return convo.user2.firstname.toLowerCase().includes(event.toLowerCase());
    });

    setSearchedConversations(filteredconvos);
  }

  const handleAttachmentButtonClick = () => {
    // Trigger a click event on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    // Get the selected file
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    if (selectedFile) {
      console.log("Selected file: ", selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        console.log("CHECK IMMAGINE");
        setContentType("image");
      } else if (selectedFile.type.startsWith("video/")) {
        console.log("CHECK VIDEO");
        setContentType("video");
      } else {
        console.log("Not image or video");
        setMfile(null);
        return;
      }
      setMfile(selectedFile);
    }
  };

  const handleLocation = () => {
    // Get the user's location
    setContentType("geolocalization");
  };

  if (contentType === "geolocalization") {
    return (
      <div
        className="p-2"
        style={
          isMobile
            ? {
                position: "absolute",
                bottom: "150px",
                // height: "45%",
                width: "100%",
                maxWidth: "100%",
                backgroundColor: theme.colors.white,
              }
            : {
                position: "absolute",
                bottom: "250px",
                // height: "45%",
                width: "100%",
                maxWidth: "100%",
                backgroundColor: theme.colors.white,
              }
        }
      >
        <Geolocation setSquealLocation={setSqueallocation} temporized={false} />
        <div
          className="d-flex justify-content-center align-items-center pt-3"
          style={{
            paddingBottom: "10px",
            backgroundColor: theme.colors.white,
          }}
        >
          <Button
            variant="danger"
            className="mx-2"
            onClick={() => {
              setContentType("text");
              setMfile(null);
            }}
          >
            Cancella
          </Button>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => {
              handleSendMessage();
            }}
          >
            Invia
          </Button>
        </div>
      </div>
    );
  }

  if (mfile) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={
          contentType === "video"
            ? {
                position: "absolute",
                bottom: "100px",
                // height: "30%",
                width: "100%",
                maxWidth: "100%",
                backgroundColor: theme.colors.white,
              }
            : {
                position: "absolute",
                bottom: "100px",

                width: "100%",
                maxWidth: "100%",
                backgroundColor: theme.colors.white,
              }
        }
      >
        <div className={contentType === "video" ? "w-100" : "w-100"}>
          <AttachPreview contentType={contentType} squealfile={mfile} />
        </div>
        <div>
          <Button
            variant="danger"
            className="mx-2"
            onClick={() => {
              setContentType("text");
              setMfile(null);
              // console.log("Cancella");
            }}
          >
            Cancella
          </Button>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => {
              handleSendMessage();
            }}
          >
            Invia
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.white,
      }}
    >
      {showsidebar ? (
        <div className={isMobile ? "p-1" : "p-3"}>
          <div
            className="sticky-top"
            style={{
              backgroundColor: theme.colors.white,
            }}
          >
            <Search
              placeholder="Cerca..."
              onChange={handleSearch}
              onClearClick={() => {
                setSearchedConversations(conversationslist);
              }}
              className="mb-3"
            />
          </div>
          {isLoading && (
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          )}

          <ConversationList scrollable>
            {searchedconversations.map((convo, key) => {
              return (
                <Conversation
                  key={key}
                  name={convo.user2?.firstname + " @" + convo.user2?.username}
                  onClick={() => {
                    setShowSidebar(!showsidebar);
                    handleCovoChange(convo);
                  }}
                  style={{
                    border: "1px solid darkgray",
                    borderRadius: "20px",
                    marginBottom: "10px",
                  }}
                  tabIndex={0}
                >
                  {/* {console.log(convo)} */}
                  <Avatar
                    src={
                      convo.user2?.profilePic
                        ? config.URL +
                          "/profilePic/" +
                          convo.user2._id +
                          convo.user2.profilePic
                        : guesticon
                    }
                    name={convo.user2?.firstname}
                  />
                </Conversation>
              );
            })}
          </ConversationList>
        </div>
      ) : (
        <div>
          <ChatContainer
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              left: "0",
              right: "0",
              overflow: "hidden",
              paddingBottom: "20px",
            }}
          >
            <ConversationHeader
              style={{
                position: "sticky",
                top: "0",
                zIndex: "1",
              }}
              tabIndex={1}
            >
              <ConversationHeader.Back
                onClick={() => {
                  setActiveConversation({});
                  setShowSidebar(!showsidebar);
                }}
                tabIndex={1}
                aria-label="Clicca per tornare alle conversazioni"
              />

              <Avatar
                src={
                  activeconversation.user2?.profilePic
                    ? config.URL +
                      "/profilePic/" +
                      activeconversation.user2?._id +
                      activeconversation.user2?.profilePic
                    : guesticon
                }
                name={activeconversation.user2.firstname}
                tabIndex={0}
              />

              <ConversationHeader.Content
                userName={activeconversation.user2.firstname}
                tabIndex={0}
              />
            </ConversationHeader>

            <MessageList>
              {messages &&
                messages.map((message, index) =>
                  // Check if the message is incoming or outgoing, check if the message is a file or a text
                  message.contentType === "text" ? (
                    <Message
                      key={index}
                      model={{
                        message: message.content,
                        sender: message.author === myself._id ? "Me" : "Other",
                        sentTime: message.createdAt,
                        direction:
                          message.author === myself._id
                            ? "outgoing"
                            : "incoming",
                      }}
                      tabIndex={0}
                      aria-label={"Testo del messaggio: " + message.content}
                    >
                      <Avatar
                        src={
                          message.author === myself._id
                            ? myself?.profilePic
                              ? config.URL +
                                "/profilePic/" +
                                myself._id +
                                myself.profilePic
                              : guesticon
                            : activeconversation.user2?.profilePic
                            ? config.URL +
                              "/profilePic/" +
                              activeconversation.user2?._id +
                              activeconversation.user2?.profilePic
                            : guesticon
                        }
                      />
                    </Message>
                  ) : message.contentType === "image" ? (
                    <Message
                      key={index}
                      model={{
                        sender: message.author === myself._id ? "Me" : "Other",
                        sentTime: message.createdAt,
                        direction:
                          message.author === myself._id
                            ? "outgoing"
                            : "incoming",
                      }}
                    >
                      {message.content[0] === "." ? (
                        <Message.ImageContent
                          src={
                            config.URL +
                            "/messagesMedia/" +
                            message._id +
                            message.content
                          }
                          alt="Immagine"
                          aria-label="Messaggio di tipo immagine"
                          width={isMobile ? "280px" : "500px"}
                          tabIndex={0}
                        />
                      ) : (
                        <Message.TextContent tabIndex={0}>
                          Immagine non disponibile
                        </Message.TextContent>
                      )}
                    </Message>
                  ) : message.contentType === "video" ? (
                    <Message
                      key={index}
                      model={{
                        sender: message.author === myself._id ? "Me" : "Other",
                        sentTime: message.createdAt,
                        direction:
                          message.author === myself._id
                            ? "outgoing"
                            : "incoming",
                      }}
                      tabIndex={0}
                    >
                      {message.content[0] === "." ? (
                        <Message.CustomContent
                          style={{
                            width: "100px",
                            height: "100px",
                          }}
                        >
                          <ReactPlayer
                            url={
                              config.URL +
                              "/messagesMedia/" +
                              message._id +
                              message.content
                            }
                            controls={true}
                            width="100%"
                            height="100%"
                            tabIndex={0}
                          />
                        </Message.CustomContent>
                      ) : (
                        <Message.TextContent tabIndex={0}>
                          Video non disponibile
                        </Message.TextContent>
                      )}
                    </Message>
                  ) : message.contentType === "geolocalization" ? (
                    <Message
                      type="custom"
                      key={index}
                      model={{
                        sender: message.author === myself._id ? "Me" : "Other",
                        sentTime: message.createdAt,
                        direction:
                          message.author === myself._id
                            ? "outgoing"
                            : "incoming",
                      }}
                    >
                      <Message.CustomContent>
                        <div
                          style={
                            isMobile
                              ? {
                                  width: "270px",
                                  height: "400px",
                                  pointerEvents: "none",
                                }
                              : {
                                  width: "400px",
                                  height: "400px",
                                  pointerEvents: "none",
                                }
                          }
                        >
                          <Geolocation
                            squeallocation={message.content}
                            temporized={false}
                          />
                        </div>
                      </Message.CustomContent>
                    </Message>
                  ) : null
                )}
            </MessageList>
          </ChatContainer>

          <div
            style={{
              position: "absolute",

              bottom: "50px",

              backgroundColor: theme.colors.white,
            }}
          >
            <Button
              onClick={handleLocation}
              style={{
                backgroundColor: theme.colors.white,
                border: "none",
                marginLeft: "0px",
              }}
              aria-label="Clicca per aggiungere una geolocazione"
            >
              <Signpost size={25} color="#6495ED" />
            </Button>
          </div>
          <div
            style={{
              position: "absolute",
              paddingBottom: "10px",
              bottom: "0px",
              width: "100%",
              maxWidth: "100%",
              backgroundColor: theme.colors.white,
            }}
          >
            <MessageInput
              placeholder="Scrivi qui il tuo messaggio"
              sendDisabled={false}
              attachDisabled={false}
              sendButton
              onSend={handleSendMessage}
              onAttachClick={handleAttachmentButtonClick}
              onChange={(e) => {
                setInputValue(e);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                setInputValue(text);
              }}
              value={inputValue}
              autoFocus
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
}

export default ChatUI;
