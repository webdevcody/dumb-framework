import classNames from "classnames";

export function hide(result: any) {
  return classNames({
    hidden: !result,
  });
}
