

export const Row = (props: any) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 10,
        justifyContent: 'space-between'
      }}
    >
      {props.children}
    </div>
  );
};
