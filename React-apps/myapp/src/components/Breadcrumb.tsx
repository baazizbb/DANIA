import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "./Breadcrumb.css";

const labelMap: Record<string, string> = {
  about: "About",
  contact: "Contact",
};

function formatSegment(segment: string) {
  if (labelMap[segment]) {
    return labelMap[segment];
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter(Boolean);

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          {pathnames.length === 0 ? (
            <span className="breadcrumb-current">Home</span>
          ) : (
              
            <Link to="/" className="breadcrumb-link">
              <FontAwesomeIcon icon={faHouse} className="breadcrumb-home-icon" aria-hidden="true" />
              Home
            </Link>
          )}
        </li>

        {pathnames.map((segment, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label = formatSegment(segment);

          return (
            <li className="breadcrumb-item" key={routeTo}>
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
