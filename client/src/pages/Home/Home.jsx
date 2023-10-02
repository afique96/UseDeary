import React from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import GenerateTask from "../../components/GenerateTask";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Flex
        minHeight="80vh"
        flexDirection="column"
        bg={useColorModeValue("gray.50", "gray.800")}
        alignItems="center"
        justifyContent="center"
      >
        <Box width="70%" maxWidth="800px" padding="20px">
          <GenerateTask />
        </Box>
      </Flex>
      <Footer />
    </>
  );
}
