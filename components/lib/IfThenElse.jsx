const IfThenElse = (props) => {
  const { if_fn, ThenComponent, ElseComponent } = props;
  return if_fn() ? <ThenComponent {...props} /> : <ElseComponent {...props} />;
};
export default IfThenElse;
