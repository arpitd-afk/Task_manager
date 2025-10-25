import React from "react";

function Error({ statusCode }) {
  return (
    <div className="page_content">
      <img src="https://www.beyoung.in/favicon-32x32.png" alt="logo" />
      <h2>Page deleted</h2>
      <a href="https://www.beyoung.in" className="back_home">
        Back to home
      </a>
      <style jsx global>{`
        body {
          font-family: "Poppins", sans-serif;
          margin: 0;
          padding: 0;
          background: #151515;
        }
        .page_content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          max-width: 100%;
          height: 100vh;
          margin: auto;
        }
        img {
          width: 100px;
          max-width: 100%;
          margin-bottom: 8px;
        }
        h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
          color: #151515;
        }
        .back_home {
          font-size: 15px;
          font-weight: 400;
          text-decoration: underline;
          padding: 5px;
        }
      `}</style>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
