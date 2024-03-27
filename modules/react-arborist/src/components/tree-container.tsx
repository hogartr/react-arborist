import React from "react";
import { useTreeApi } from "../context";
import { DefaultContainer } from "./default-container";

export function TreeContainer() {
  const tree = useTreeApi();

  if (tree.props.renderContainer) {
    const Container = tree.props.renderContainer;
    return <Container />;
  }

  return (
    <>
      <DefaultContainer ref={tree.props.containerRef} />
    </>
  );
}
