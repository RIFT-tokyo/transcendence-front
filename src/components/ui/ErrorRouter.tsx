import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';

type Props = {
  statusCode: number
  children: ReactNode
}

const ErrorRouter: React.VFC<Props> = ({ statusCode, children }) => {
  switch (statusCode) {
    case 0:
      return <>{children}</>;
    case 404:
      return <Navigate to="/404" />;
    case 500:
      return <Navigate to="/500" />;
    default:
      return <div>Unknown Status Code: {statusCode}</div>
  }
}

export default ErrorRouter