import { NavLink } from "react-router";

type Props = {
  href: string;
  text: string;
};

export const NavItem = ({ href, text }: Props) => {
  //   const [isActive, setIsActive] = useState(false);
  //   const style = isActive ? { color: "black" } : { color: "white" };
  //   console.log(style);
  return (
    <NavLink
      to={href}
      //className="text-gray-900 dark:text-white hover:text-blue-600 px-3 py-2 "
      className={({ isActive }) =>
        isActive
          ? "text-gray-900 dark:text-white hover:text-blue-600 px-3 py-2 border-solid border-b-2 max-w-fit"
          : "text-gray-900 dark:text-white hover:text-blue-600 px-3 py-2"
      }
    >
      {text}
    </NavLink>
  );
};
