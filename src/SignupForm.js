import React from "react";
import { Container } from "react-bootstrap";
import SignupFormContent from "./SignupFormContent";

function SignupForm() {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Sign Up</h1>
      <SignupFormContent />
    </Container>
  );
}

export default SignupForm;
