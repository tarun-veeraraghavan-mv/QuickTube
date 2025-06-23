import ProcessVideoInput from "@/components/ProcessVideoInput";
import UserVideos from "@/components/UserVideos";
import ScreenContainer from "@/components/ui/ScreenContainer";

export default function Home() {
  return (
    <ScreenContainer>
      <ProcessVideoInput />
      <UserVideos />
    </ScreenContainer>
  );
}
