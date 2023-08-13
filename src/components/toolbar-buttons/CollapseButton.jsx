import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import "../../App.css";

import PropTypes from "prop-types";
CollapseButton.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default function CollapseButton({ isCollapsed, setIsCollapsed }) {
  return (
    <div>
      {isCollapsed === true && (
        <Tooltip placement="topLeft" title="Expandir">
          <DownOutlined
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="toolbar__icon"
          ></DownOutlined>
        </Tooltip>
      )}

      {isCollapsed === false && (
        <Tooltip placement="topLeft" title="Colapsar">
          <RightOutlined
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="toolbar__icon"
          ></RightOutlined>
        </Tooltip>
      )}
    </div>
  );
}
