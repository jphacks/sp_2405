import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  component: ReactNode;
  redirect: string;
  condition: boolean;
};

const PrivateRoute = (props: Props) => {
  // console.log(props.redirect, props.condition);

  if (props.condition) return props.component;
  else return <Navigate to={props.redirect} />;
};

export default PrivateRoute;
