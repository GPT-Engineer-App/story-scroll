import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Link, Input, useColorMode, IconButton, HStack } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStoriesResponse = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const topStoryIds = topStoriesResponse.data.slice(0, 5);
        const storyPromises = topStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storiesData = await Promise.all(storyPromises);
        setStories(storiesData.map(story => story.data));
        setFilteredStories(storiesData.map(story => story.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW={{ base: "container.sm", md: "container.md" }} py={{ base: 2, md: 4 }}>
      <HStack width="100%" justifyContent="space-between" mb={{ base: 2, md: 4 }}>
        <Text fontSize={{ base: "xl", md: "2xl" }}>Top 5 Hacker News Stories</Text>
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </HStack>
      <Input
        placeholder="Search stories..."
        mb={{ base: 2, md: 4 }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <VStack spacing={4} width="100%">
        {filteredStories.map(story => (
          <Box key={story.id} p={{ base: 2, md: 4 }} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{story.title}</Text>
            <Text>Upvotes: {story.score}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;