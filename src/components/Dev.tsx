export const Dev = (props: { value: any }) => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
    return <div>{JSON.stringify(props.value)}</div>;
  return null;
};
