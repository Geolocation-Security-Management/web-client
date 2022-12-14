import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import NavBar from "../../common/components/NavBar";
import Feed from "./components/feed/Feed";
import useMobileViewToggle from "../../common/utils/useMobileViewToggle";
import FeedSkeleton from "./components/feed/FeedSkeleton";
import EventSection from "./components/event/EventSection";
import EventSectionSkeleton from "./components/event/EventSectionSkeleton";
import ProfileSection from "./components/profile/ProfileSection";
import { useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import ProfileSectionSkeleton from "./components/profile/ProfileSectionSkeleton";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../../common/utils/firebase";
import { IEvent, IPersonnel } from "../../common/interface/interface";

const HomePage: React.FC = () => {
  const [personnelData, setPersonnelData] = useState<
    IPersonnel[] | undefined
  >();
  const [eventData, setEventData] = useState<IEvent[] | undefined>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API,
    libraries: ["places"],
  });

  const [currentFeed, setCurrentFeed] = useState<string>("Map visualiser");
  const handleFeedSwitch = (feedSwitch: string) => {
    setCurrentFeed(feedSwitch);
  };

  const [isLargerThan1080] = useMediaQuery("(min-width: 1080px)");
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

  useEffect(() => {
    const personnelQuery = ref(db, "personnel");
    onValue(personnelQuery, (snapshot) => {
      setPersonnelData(() => snapshot.val());
    });

    const eventQuery = ref(db, "event");
    onValue(eventQuery, (snapshot) => {
      setEventData(() => snapshot.val());
    });
  }, []);

  return (
    <>
      <NavBar />
      <Flex
        flexDir={"row"}
        px={20}
        py={5}
        bgColor={"#141517"}
        justifyContent={"center"}
        gap={5}
        minHeight={"90vh"}
      >
        {isLargerThan900 && (
          <>
            {!personnelData && <ProfileSectionSkeleton />}
            {personnelData && (
              <ProfileSection
                feedSwitch={handleFeedSwitch}
                currentFeed={currentFeed}
              />
            )}
          </>
        )}

        {!personnelData && <FeedSkeleton />}
        {personnelData && eventData && personnelData && (
          <Box width={[550, 650, 800]}>
            <Feed
              isLoaded={isLoaded}
              currentFeed={currentFeed}
              personnelListData={personnelData}
              eventListData={eventData}
            />
          </Box>
        )}

        {isLargerThan900 && isLargerThan1080 && (
          <>
            {!eventData && <EventSectionSkeleton />}
            {eventData && (
              <EventSection isLoaded={isLoaded} eventListData={eventData} />
            )}
          </>
        )}
      </Flex>
    </>
  );
};

export default HomePage;
