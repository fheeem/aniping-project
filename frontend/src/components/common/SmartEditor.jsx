import { useState } from "react";
import { Button, Modal, Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "scroll",
};

export default function SmartEditor() {
  const [sendData, setSendData] = useState();

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => {
    const mailBody = document
      .getElementById("iframeContainer_iframe")
      .contentWindow.submitPost();

    setSendData(mailBody);

    setOpen2(true);
  };
  const handleClose2 = () => setOpen2(false);

  return (
    <div id="container" className="iframeContainer">
      <iframe
        id="iframeContainer_iframe"
        allowFullScreen={true}
        width={"100%"}
        height={"700"}
        scrolling={"no"}
        name="myframe"
        frameBorder={"0"}
        src="../../../smartEditer/write.html"
      ></iframe>
      <Button variant="outlined" onClick={handleOpen2}>
        미리보기
      </Button>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div dangerouslySetInnerHTML={{ __html: sendData }}></div>
        </Box>
      </Modal>
    </div>
  );
}