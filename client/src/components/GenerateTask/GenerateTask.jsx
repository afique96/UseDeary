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
import DisplayPlan from "../DisplayPlan";

/*
  const renderPlan = () => {
    const lines = plan.split("\n");
    return (
      <List spacing={3}>
        {lines.map((line, index) => (
          <ListItem key={index}>{line}</ListItem>
        ))}
      </List>
    );
  };

  */

function GenerateTask() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [planAllDays, setPlanAllDays] = useState(null);
  const [planCalendarSchedule, setplanCalendarSchedule] = useState(null);
  const [planPaidSuggestions, setplanPaidSuggestions] = useState(null);

  const toast = useToast();
  const dispatch = useDispatch();
  const isLogged = useSelector(getIsLogged);
  const user = useSelector(getUser);
  const myPlan = useSelector(getPlans);

  const formBackground = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    //Object.keys(myPlan).length !== 0
    if (myPlan) {
      setPlan(myPlan);
      parseLearningPlan(myPlan);
    }
  }, [myPlan]);

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);

    var createPlanResponse = null;

    // Check if the user already has a plan, e.g., by checking the 'myPlan' variable
    if (myPlan && myPlan.length > 0 && !isLogged) {
      setShowAlert(true); // Display the alert
    } else {
      createPlanResponse = await axios.post(
        "http://localhost:5000/plan/create",
        {
          goal,
        }
      );
      setPlan(createPlanResponse.data.result);

      parseLearningPlan(createPlanResponse.data.result);

      try {
        console.log(user);
        const response = await axios.post(
          `http://localhost:5000/user/decreaseCredit/${user.user_id}`,
          {}
        );
        console.log(response.data);
        // Handle the response as needed
      } catch (error) {
        console.error(error);
        // Handle errors if any
      }
    }

    if (createPlanResponse) {
      dispatch(setPlans({ plans: createPlanResponse.data.result }));
    }
    setLoading(false);
  };

  const submitPlan = async () => {
    if (isLogged) {
      // Prepare the plan data for submission
      const planData = {
        user_id: user.user_id,
        days: planAllDays,
        subject: goal,
        calendar_schedule: planCalendarSchedule,
        paid_suggestions: planPaidSuggestions,
      };

      try {
        const response = await axios.post(
          baseUrl + `/plan/submitPlan`,
          planData
        ); // Replace '/api/submitPlan' with your actual API endpoint
        console.log(response.data);

        // Display a success toast message
        toast({
          title: "Plan Submitted",
          description: "Your learning plan has been successfully submitted.",
          status: "success",
          duration: 5000, // Duration of the toast message in milliseconds
          isClosable: true, // Allow the user to close the toast
        });

        // Handle the response as needed
      } catch (error) {
        console.error(error);
        // Handle errors if any
      }
    } else {
      // Display a warning toast message if the user is not logged in
      toast({
        title: "You are not logged in",
        description: "Please log in or register to submit your plan.",
        status: "warning",
        duration: 5000, // Duration of the toast message in milliseconds
        isClosable: true, // Allow the user to close the toast
      });
    }
  };

  const extractDays = (weekContent) => {
    const days = [];
    if (weekContent) {
      const dayRegex = /Day \d+:(.*?)(?=Day \d+:|$)/gs;
      let match;
      while ((match = dayRegex.exec(weekContent[1]))) {
        days.push(match[0]);
      }
    }
    return days;
  };

  const parseLearningPlan = (learningPlan) => {
    console.log("akif: ", learningPlan);
    setPlan(learningPlan);
    // set plan for redux

    // Use regular expressions to extract information from the learning plan
    const week1 = learningPlan.match(/Week 1:(.*?)(?=Week 2:|$)/s);
    const week2 = learningPlan.match(
      /Week 2:(.*?)(?=Suggested Calendar Schedule:|$)/s
    );
    const calendarSchedule = learningPlan.match(
      /Suggested Calendar Schedule:(.*?)(?=Paid Content Recommendations:|$)/s
    );
    const paidSuggestions = learningPlan.match(
      /Paid Content Recommendations:(.*?)(?=\n\s*\S+:|$)/s
    );

    // Extract days from both weeks
    const week1Days = extractDays(week1);
    const week2Days = extractDays(week2);

    // Concatenate the days from both weeks into a single array
    const allDays = [...week1Days, ...week2Days];

    setPlanAllDays(allDays);
    setplanCalendarSchedule(calendarSchedule ? calendarSchedule[0] : null);
    setplanPaidSuggestions(paidSuggestions ? paidSuggestions[0] : null);
  };

  return (
    <Box bg={formBackground} p={12} rounded={6}>
      {showAlert && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          <Text>
            You already have a learning plan.{" "}
            {!isLogged ? (
              <>
                Please{" "}
                <Link href="/login" color="yellow.200">
                  sign in
                </Link>{" "}
                or{" "}
                <Link href="/register" color="yellow.200">
                  sign up
                </Link>{" "}
                to create another plan.
              </>
            ) : (
              "You can't create another plan without signing out."
            )}
          </Text>
        </Alert>
      )}
      <form onSubmit={generatePlan}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Goal</FormLabel>
            <Input
              placeholder="What do you want to learn?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={loading}
            disabled={myPlan !== null && myPlan.length > 0}
          >
            Generate Plan
          </Button>
        </VStack>
      </form>

      <Button
        colorScheme="blue"
        type="submit"
        isLoading={loading}
        disabled={myPlan !== null && myPlan.length > 0}
        onClick={() => {
          if (myPlan) {
            dispatch(setPlans({ plans: null }));
          }
        }}
      >
        Reset Redux
      </Button>

      {loading ? (
        <Spinner mt={6} />
      ) : (
        planAllDays && (
          <VStack spacing={4}>
            <DisplayPlan
              plan={plan}
              planAllDays={planAllDays}
              planCalendarSchedule={planCalendarSchedule}
              planPaidSuggestions={planPaidSuggestions}
            />

            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              onClick={submitPlan}
            >
              Submit Plan
            </Button>
          </VStack>
        )
      )}
    </Box>
  );
}

export default GenerateTask;
