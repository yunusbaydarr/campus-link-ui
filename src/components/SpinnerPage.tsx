import React from "react";
import "../css/Spinner.css";

const SpinnerPage: React.FC = () => {
  return (
    <div className="mb-40 flex h-[120rem] w-[120rem] items-center justify-center">
      <div className="Spinner_spinner__iOJdf">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SpinnerPage;
