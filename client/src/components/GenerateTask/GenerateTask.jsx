import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  getIsLogged,
  logOut,
  getUser,
  getPlans,
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
} from "@chakra-ui/react";

function GenerateTask() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogged = useSelector(getIsLogged);
  const user = useSelector(getUser);
  const plans = useSelector(getPlans);

  const formBackground = useColorModeValue("gray.100", "gray.700");

  const submitGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    /*
    const response = await axios.post("http://localhost:5000/plan/create", {
      goal,
    });
    setPlan(response.data.result);
    */
    setLoading(false);

    const learningPlan = `Sure! Here's a day-by-day learning plan for you to learn about modern art in 2 weeks:

    Week 1:
    Day 1:
    - Task: Introduction to Modern Art
    - Duration: 1 hour
    - Content: Watch a short video or read an article that provides an overview of modern art and its significance.
    - Source: https://www.khanacademy.org/humanities/art-1010/art-between-wars/modern-culture/a/introduction-to-modern-art
    
    Day 2:
    - Task: Art Movements of the 19th and 20th Centuries
    - Duration: 1 hour
    - Content: Learn about key art movements like Impressionism, Cubism, Surrealism, and Abstract Expressionism, and their major artists and artworks.
    - Source: https://www.tate.org.uk/art/art-terms/m/movement
    
    Day 3:
    - Task: Famous Modern Artists
    - Duration: 1.5 hours
    - Content: Research and familiarize yourself with the works of influential modern artists such as Pablo Picasso, Salvador Dali, Jackson Pollock, Frida Kahlo, and Andy Warhol.
    - Source: https://www.theartstory.org/
    
    Day 4:
    - Task: Art Techniques and Styles in Modern Art
    - Duration: 1.5 hours
    - Content: Explore various techniques and styles employed in modern art, such as collage, assemblage, pop art, and installation art.
    - Source: https://www.invaluable.com/blog/modern-art/
    
    Day 5:
    - Task: Studying Modern Art Movements in-depth
    - Duration: 2 hours
    - Content: Focus on one modern art movement that interests you the most and delve deeper into its history, key artworks, and artists.
    - Source: https://www.metmuseum.org/toah/hd/abex/hd_abex.htm
    
    Weekend Break: Take a break from reading and engage in creative activities like sketching or visiting an art museum if possible to immerse yourself in modern art.
    
    Week 2:
    Day 6:
    - Task: Understanding the Context of Modern Art
    - Duration: 1 hour
    - Content: Learn about the historical, social, and cultural contexts that influenced the development of modern art.
    - Source: https://www.lepage-museum.com/information/history-of-modern-art/
    
    Day 7:
    - Task: Modern Art and Political Commentary
    - Duration: 1.5 hours
    - Content: Explore how modern artists have used their art as a means to express political and social messages.
    - Source: https://www.moma.org/magazine/articles/199
    
    Day 8:
    - Task: Exploring Modern Art Installations
    - Duration: 1 hour
    - Content: Discover the concept of art installations and their significance in modern art.
    - Source: https://www.tate.org.uk/art/art-terms/i/installation-art
    
    Day 9:
    - Task: Women Artists in Modern Art
    - Duration: 1.5 hours
    - Content: Learn about the contributions and achievements of women artists in the modern art movement.
    - Source: https://nmwa.org/explore/modern-and-contemporary-art
    
    Day 10:
    - Task: Modern Art Today
    - Duration: 1 hour
    - Content: Explore how modern art continues to evolve and shape contemporary art movements.        
    - Source: https://www.artspace.com/magazine/art_101/in_focus/what-is-modern-art-58388
    
    Weekend Break: Reflect on the knowledge you have gained so far and visit an art exhibition or gallery to experience modern art firsthand, if possible.
    
    Suggested Calendar Schedule:
    Week 1:
    - Day 1: Introduction to Modern Art (1 hour)
    - Day 2: Art Movements of the 19th and 20th Centuries (1 hour)
    - Day 3: Famous Modern Artists (1.5 hours)
    - Day 4: Art Techniques and Styles in Modern Art (1.5 hours)
    - Day 5: Studying Modern Art Movements in-depth (2 hours)
    
    Week 2:
    - Day 6: Understanding the Context of Modern Art (1 hour)
    - Day 7: Modern Art and Political Commentary (1.5 hours)
    - Day 8: Exploring Modern Art Installations (1 hour)
    - Day 9: Women Artists in Modern Art (1.5 hours)
    - Day 10: Modern Art Today (1 hour)
    
    Please note that the duration for each task can be adjusted based on your own pace and interests. Enjoy your learning journey into the world of modern art!
    
    Paid content suggestions:
    1. Online Course: "Modern Art and Ideas" offered by Coursera (https://www.coursera.org/learn/modern-art-ideas)
    2. Book: "Modern Art: A Very Short Introduction" by David Cottington (available on Amazon or your local bookstore)`;
    setPlan(learningPlan);

    // Use a regular expression to match the content between "Week 1:" and "Week 2:"
    const week1 = learningPlan.match(/Week 1:(.*?)(?=Week 2:|$)/s);
    const week2 = learningPlan.match(
      /Week 2:(.*?)(?=Suggested Calendar Schedule:|$)/s
    );
    const calendarSchedule = learningPlan.match(
      /Suggested Calendar Schedule:(.*?)(?=Paid content suggestions:|$)/s
    );
    const paidSuggestions = learningPlan.match(
      /Paid content suggestions:(.*?)(?=\n\s*\S+:|$)/s
    );

    function extractDays(weekContent) {
      const days = [];
      if (weekContent) {
        const dayRegex = /Day \d+:(.*?)(?=Day \d+:|$)/gs;
        let match;
        while ((match = dayRegex.exec(weekContent[1]))) {
          days.push(match[0]);
        }
      }
      return days;
    }

    const week1Days = extractDays(week1);
    const week2Days = extractDays(week2);

    // Concatenate the days from both weeks into a single array
    const allDays = [...week1Days, ...week2Days];

    console.log("All Days:");
    console.log(allDays);

    console.log("Calendar Schedule:");
    console.log(calendarSchedule[0]);

    console.log("Paid Suggestions:");
    console.log(paidSuggestions[0]);

    console.log("user.user_id: ");
    console.log(user.user_id);
  };

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

  return (
    <Box bg={formBackground} p={12} rounded={6}>
      <form onSubmit={submitGoal}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Goal</FormLabel>
            <Input
              placeholder="What do you want to learn?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit" isLoading={loading}>
            Generate Plan
          </Button>
        </VStack>
      </form>
      {loading ? (
        <Spinner mt={6} />
      ) : (
        plan && (
          <Box mt={6} border="1px" borderColor="gray.200" p={4}>
            {renderPlan()}
          </Box>
        )
      )}
    </Box>
  );
}

export default GenerateTask;
