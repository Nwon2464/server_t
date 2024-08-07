import React, { useRef } from "react";
const LoginRenderField = (props) => {
  const anchorRef = useRef();
  const inputRef = useRef();
  // const [anchorHeight, setAnchorHeight] = useState(0);
  // useEffect(() => {
  //   const offSetWidth = anchorRef.current.offsetWidth;
  //   setAnchorHeight(offSetWidth);
  // }, []);
  const className = `app__input ${props.meta.active && ""}`;
  return (
    <div className="field" style={{ position: "relative" }}>
      <label>
        <a ref={anchorRef} style={{ fontSize: "1rem" }}>
          {props.label}
        </a>
      </label>
      <div>
        <input
          autoFocus={props.autoFocus}
          // ref={inputRef}
          className={className}
          {...props.input}
          type={props.type}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
export default LoginRenderField;
