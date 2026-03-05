import { Button as UIButton, buttonVariants } from "../ui/button";

export { buttonVariants };

export function Button(props: React.ComponentProps<typeof UIButton>) {
  return <UIButton {...props} />;
}
