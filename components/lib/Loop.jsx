function Loop(props) {
  // console.log("loop props", props)
  const { mappable, Component } = props;
  if (!(mappable && Component)) {
    return (
      <div>
        <i>No data available</i>
      </div>
    );
  }
  return mappable.map((value, i) => {
    return <Component key={i} value={value} index={i} {...value} />;
  });
}

export default Loop;
