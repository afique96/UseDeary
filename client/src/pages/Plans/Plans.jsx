import baseUrl from "../../data/baseUrl";
import { useSelector, useDispatch } from "react-redux";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Divider,
} from "@chakra-ui/react";
import {
  getIsLogged,
  logOut,
  getUser,
  getPlans,
  setPlans,
} from "../../reducers/authSlice";
import Footer from "../../components/Footer";
import DisplayPlan from "../../components/DisplayPlan";
import axios from "axios";

export default function Plans() {
  const [plans, setPlans] = useState([]); // State for storing plans
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const isLogged = useSelector(getIsLogged);
  const user = useSelector(getUser);

  useEffect(() => {
    axios
      .get(baseUrl + `/plan/getPlansByUserId/${user.user_id}`)
      .then((response) => {
        setPlans(response.data.plans);
        console.log("akif: ", response.data.plans);
      })

      .catch((error) => {
        console.error("Error fetching plans:", error);
      });
  }, []);

  // Define a function to open the modal and set the selected plan
  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Define a function to close the modal
  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Flex
        minHeight="80vh"
        flexDirection="column"
        bg={useColorModeValue("gray.50", "gray.800")}
        alignItems="center"
        justifyContent="center"
        textAlign="center" // Center the text horizontally
      >
        <Heading as="h2" size="lg" mb={4}>
          My Plans
        </Heading>
        <Divider mb={4} /> {/* Add a line under the heading */}
        {/* Render your plans here */}
        {plans.map((plan) => (
          <Box
            key={plan.plan_id}
            width="70%"
            maxWidth="800px"
            padding="20px"
            onClick={() => openModal(plan)}
            cursor="pointer"
          >
            <Button
              minW="200px"
              minHeight="100px"
              colorScheme="blue" // Set the background color
              variant="solid" // Use a solid style
              color="black" // Set text color to black
              textTransform="uppercase" // Uppercase the text
            >
              {plan.subject || `UseDeary Plan`}
            </Button>
          </Box>
        ))}
      </Flex>

      <Footer />

      {/* Modal for displaying plan */}
      {selectedPlan && (
        <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
          {" "}
          {/* Set the modal size to extra large (xl) */}
          <ModalOverlay />
          <ModalContent minW="800px">
            <ModalHeader textTransform="uppercase">
              {selectedPlan.subject || `UseDeary Plan`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Render the DisplayPlan component with selectedPlan */}

              <DisplayPlan
                planAllDays={selectedPlan.days}
                planCalendarSchedule={selectedPlan.calendar_schedule}
                planPaidSuggestions={selectedPlan.paid_suggestions}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
