import React from "react";

function Footer() {
  return (
    <>
      <style>{`
        *, *:before, *:after {
          box-sizing: border-box;
        }

        html {
          font-size: 100%;
        }

        body {
          font-family: acumin-pro, system-ui, sans-serif;
          margin: 0;
          display: grid;
          grid-template-rows: auto 1fr auto;
          font-size: 14px;
          background-color: #f4f4f4;
          align-items: start;
          min-height: 100vh;
        }

        .footer {
          display: flex;
          flex-flow: row wrap;
          padding: 30px 30px 20px 30px;
          color: #2f2f2f;
          background-color: #fff;
          border-top: 1px solid #e5e5e5;
        }

        .footer > * {
          flex: 1 100%;
        }

        .footer__addr {
          margin-right: 1.25em;
          margin-bottom: 2em;
        }

        .footer__logo {
          width: 120px;
          height: auto;
        }

        .footer__addr h2 {
          margin-top: 1.3em;
          font-size: 15px;
          font-weight: 400;
        }

        .nav__title {
          font-weight: 400;
          font-size: 15px;
        }

        .footer address {
          font-style: normal;
          color: #999;
        }

        .footer ul {
          list-style: none;
          padding-left: 0;
        }

        .footer li {
          line-height: 2em;
          font-size: 19px;
        }

        .footer li:hover {
  color: #044a9b;
}

        .footer a {
          text-decoration: none;
        }

        .footer__nav {
          display: flex;
          flex-flow: row wrap;
        }

        .footer__nav > * {
          flex: 1 50%;
          margin-right: 1.25em;
        }

        .nav__ul a {
          color: #999;
        }

        @media screen and (min-width: 40.375em) {
          .footer__nav > * {
            flex: 1;
          }

          .footer__addr {
            flex: 1 0px;
          }

          .footer__nav {
            flex: 2 0px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer__addr">
<img
  className="footer__logo"
  src="https://i.pinimg.com/originals/48/a1/91/48a191cf436936466f66599a6aa0eda9.gif"
  alt="LearnStack Logo"
/>

          <h2>AI POWERED LEARNING</h2>

          <address>
            Enhancing Student Learning Through Digital Collaboration
            <br />
          </address>
        </div>

        <ul className="footer__nav">
          <li className="nav__item">
            <ul className="nav__ul">
              <li >
                <a href="/askquestion">Ask Questions</a>
              </li>

              <li>
                <a href="#">Browse Question</a>
              </li>

              <li>
                <a href="#">Chat with AI</a>
              </li>

              <li>
                <a href="#">About</a>
              </li>
            </ul>
          </li>
        </ul>
      </footer>
    </>
  );
}

export default Footer;
