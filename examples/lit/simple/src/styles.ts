import { css } from 'lit';

export const styles = css`
  form {
    max-width: 600px;
    margin: 10px auto;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 1 1 2px rgba(0, 0, 0, 0.3);
    padding: 10px;
    display: flex;
    flex-flow: column nowrap;
  }

  h1 {
    text-align: center;
    color: #333;
  }

  p {
    margin: 10px auto;
    line-height: 1.2em;
    max-width: 500px;
  }

  div {
    margin: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }

  label {
    width: 120px;
    text-align: right;
    margin-right: 15px;
    padding: 5px;
  }

  input {
    padding: 5px;
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  select {
    flex: 1;
    height: 24px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  span {
    color: #600;
    font-weight: bold;
    margin: 0 0 0 10px;
    line-height: 26px;
  }

  button {
    width: 80px;
    display: block;
    margin: 0 auto;
  }
`;
