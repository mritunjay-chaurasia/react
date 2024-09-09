import React, { useRef } from "react";

const AttachedFile = ({selectedMedia}) => {

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      console.log("selected image>>>>>>>>>>>>  1", files);

      // Convert FileList to Array
      const filesArray = Array.from(files);
      selectedMedia({ key: "files", value: filesArray });

      // Reset the input value
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 0);
    }
  };

  return (
    <>
      <span data-testid="issue.issue-view.views.issue-base.foundation.quick-add.quick-add-item.add-attachment">
        <input
          type="file"
          id="file-input-type"
          style={{ display: "none" }}
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          // onChange={(e) =>
          //   onUpdateTicketData({ key: "files", value: e.target.files })
          // }
        />
        <button
          aria-label="Attach"
          style={{
            alignItems: "baseline",
            background: "var(--ds-background-neutral, rgba(9, 30, 66, 0.04))",
            borderRadius: "3px",
            borderWidth: "0",
            cursor: "pointer",
            display: "inline-flex",
            fontWeight: "500",
            height: "2.28571em",
            justifyContent: "center",
            lineHeight: "2.28571em",
            margin: "0",
            maxWidth: "100%",
            padding: "0 10px",
            position: "relative",
            textAlign: "center",
            transition:
              "background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)",
            verticalAlign: "middle",
            whiteSpace: "nowrap",
          }}
          onClick={() => document.getElementById("file-input-type").click()}
        >
          <span style={{ display: "flex", marginRight: "-4px" }}>
            <span style={{ marginLeft: "-4px", marginRight: "-2px" }}>
              <span aria-hidden="true">
                <svg
                  height="24"
                  role="presentation"
                  style={{
                    height: "24px",
                    width: "24px",
                    color: "currentColor",
                    fill: "var(--ds-surface, #FFFFFF)",
                  }}
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path
                    d="M11.643 17.965c-1.53 1.495-4.016 1.496-5.542.004a3.773 3.773 0 01.002-5.412l7.147-6.985a2.316 2.316 0 013.233-.003c.893.873.895 2.282.004 3.153l-6.703 6.55a.653.653 0 01-.914-.008.62.62 0 010-.902l6.229-6.087a.941.941 0 000-1.353.995.995 0 00-1.384 0l-6.23 6.087a2.502 2.502 0 000 3.607 2.643 2.643 0 003.683.009l6.703-6.55a4.074 4.074 0 00-.003-5.859 4.306 4.306 0 00-6.002.003l-7.148 6.985a5.655 5.655 0 00-.001 8.118c2.29 2.239 6.015 2.238 8.31-.005l6.686-6.533a.941.941 0 000-1.353.995.995 0 00-1.384 0l-6.686 6.534z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
            </span>
          </span>
        </button>
      </span>
    </>
  );
};
export default AttachedFile;
