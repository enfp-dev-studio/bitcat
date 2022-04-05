export const Row = (props: any) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 10,
        // justifyContent: 'space-between'
      }}
    >
      {props.children}
    </div>
  );
};

export const VerticalDivider = (props: any) => {
  return (
    <div
      style={{
        height: 'inherit',
        width: 1,
        backgroundColor: "grey",
        marginLeft: 10,
        marginRight: 10
        // justifyContent: 'space-between'
      }}
    ></div>
  );
};
