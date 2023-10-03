import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  getIsLogged,
  logOut,
  getUser,
  getPlans,
  setPlans,
} from "../../reducers/authSlice";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useColorModeValue,
  VStack,
  Spinner,
  List,
  ListItem,
  Alert,
  AlertIcon,
  Link,
  useToast,
} from "@chakra-ui/react";
import baseUrl from "../../data/baseUrl";

function DisplayPlan({
  planAllDays,
  planCalendarSchedule,
  planPaidSuggestions,
}) {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex className="display_plan" direction="column" alignItems="flex-start">
      <Box mt={6} borderColor="gray.200" p={4}>
        <Box
          bg="blue.300" // Light blue background color
          p={4} // Padding
          rounded="md" // Rounded corners
          boxShadow="md" // Box shadow for styling
        >
          <Text
            fontSize="2xl" // Increased font size
            fontWeight="bold" // Bold font weight
            color="blue.700" // Blue color
            alignSelf="flex-start"
            mb={4} // Margin bottom for separation from the plan content
          >
            Day by Day Plan:
          </Text>
          <VStack spacing={4}>
            {planAllDays.map((day, index) => (
              <Box
                key={index}
                bg="blue.200" // Light blue background color
                p={4} // Padding
                rounded="md" // Rounded corners
                boxShadow="md" // Box shadow for styling
                overflowY="auto" // Add vertical scrollbar when content exceeds box height
                minW="700px" // Set a maximum height for the box
              >
                {/* You can parse the day content here and format it as needed */}
                {day.split("\n").map((line, lineIndex) => (
                  <Text color={"black"} key={lineIndex}>
                    {line}
                  </Text>
                ))}
              </Box>
            ))}
          </VStack>
        </Box>
        {/* Display planCalendarSchedule */}
        {planCalendarSchedule && (
          <Box
            bg="teal.200" // Light teal background color
            p={4} // Padding
            rounded="md" // Rounded corners
            boxShadow="md" // Box shadow for styling
            mt={4} // Margin top for separation from the plan content
            minW="700px" // Set a maximum height for the box
          >
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              Suggested Calendar Schedule:
            </Text>
            {/* Parse and display the schedule */}
            {planCalendarSchedule.split("\n").map((line, lineIndex) => (
              <Text color={"black"} key={lineIndex}>
                {line}
              </Text>
            ))}
          </Box>
        )}

        {/* Display planPaidSuggestions */}
        {planPaidSuggestions && (
          <Box
            bg="green.200" // Light green background color
            p={4} // Padding
            rounded="md" // Rounded corners
            boxShadow="md" // Box shadow for styling
            mt={4} // Margin top for separation from the plan content
            minW="700px" // Set a maximum height for the box
          >
            <Text fontSize="xl" fontWeight="bold" color="green.500">
              Paid Content Recommendations:
            </Text>
            {/* Parse and display the suggestions */}
            {planPaidSuggestions.split("\n").map((line, lineIndex) => (
              <Text color={"black"} key={lineIndex}>
                {line}
              </Text>
            ))}
          </Box>
        )}
      </Box>
    </Flex>
  );
}

export default DisplayPlan;
