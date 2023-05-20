import { useState } from "react";
import NewNoteModal from "../NewNoteModal";
import { FloatButton, Button, theme, ConfigProvider } from "antd";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { PlusOutlined } from "@ant-design/icons";

export default function NewNoteFloatButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {showModal ? <NewNoteModal setShowModal={setShowModal} /> : null}
      <div
        style={{
          position: "fixed",
          right: "40px",
          bottom: "40px",
        }}
      >
        {/* <Fab
          onClick={() => {
            setShowModal(true);
          }}
          size="medium"
          aria-label="add"
        >
          <AddIcon />
        </Fab> */}
        <ConfigProvider
          theme={{
            components: {
              FloatButton: {
                colorPrimaryHover: "rgb(10,10,10)",
                colorPrimary: "gray",
                colorTextLightSolid: "white",
              },
            },
          }}
        >
          <FloatButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowModal(true);
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
