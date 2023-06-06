import { RightOutlined, DownOutlined } from "@ant-design/icons";

//add proptypes to component
import PropTypes from "prop-types";
CollapseButton.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default function CollapseButton({ isCollapsed, setIsCollapsed }) {
  return (
    <div>
      {isCollapsed === true && (
        <RightOutlined
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="toolbar__icon"
        ></RightOutlined>
      )}

      {isCollapsed === false && (
        <DownOutlined
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="toolbar__icon"
        ></DownOutlined>
      )}
    </div>
  );
}
