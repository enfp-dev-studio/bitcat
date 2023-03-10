export const Row = (props: any) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        // padding: 10,
        // justifyContent: "space-between",
      }}
    >
      {props.children}
    </div>
  );
};

export const RowRight = (props: any) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        padding: 10,
        justifyContent: "flex-end",
      }}
    >
      {props.children}
    </div>
  );
};

export const VerticalDivider = () => {
  return (
    <div
      style={{
        height: "inherit",
        width: 1,
        backgroundColor: "grey",
        marginLeft: 10,
        marginRight: 10,
        // justifyContent: 'space-between'
      }}
    ></div>
  );
};

export const HorizontalDivider = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "grey",
        margin: 10,
        // justifyContent: 'space-between'
      }}
    ></div>
  );
};
