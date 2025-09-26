import { createFileRoute } from '@tanstack/react-router';
import HomePageContainer from '../components/home-page/home-page';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <HomePageContainer />;
}
