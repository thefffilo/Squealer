import "../../css/PostHeader.css";
import theme from "../../config/theme";
import { Avatar } from "@mui/material";
import { PatchCheckFill } from "react-bootstrap-icons";
// import { Button } from "react-bootstrap";
import guesticon from "../../assets/guesticon.png";
import config from "../../config/config";

import { useNavigate } from "react-router-dom";

function PostHeader({ item }) {
  const navigate = useNavigate();
  function handleUserClick() {
    navigate("/" + item?.username);
  }

  return (
    <div className="row">
      <div className="d-flex">
        <div className="m-1">
          <Avatar
            src={
              item?.profilePic
                ? config.URL + "/profilePic/" + item._id + item.profilePic
                : guesticon
            }
            alt={"Immagine profilo di " + item?.firstname + item?.surname}
            tabIndex="0"
          />
        </div>
        <div
          className="p-1 usernametext"
          onClick={handleUserClick}
          tabIndex={0}
        >
          {item?.firstname} {item?.surname}
        </div>

        {item?.verified && (
          <div className="p-1">
            <PatchCheckFill color={theme.colors.lightblue} />
          </div>
        )}

        <div
          className="p-1"
          style={{
            color: theme.colors.lightgrey,
          }}
          tabIndex={0}
        >
          @{item?.username}
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
