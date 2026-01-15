export interface Robot {
  id: string;
  robotName: string;
  teamName: string;
  teamNumber: string;
  season: string;
  description: string;
  fullDescription?: string;
  image: string;
  country?: string;
  city?: string;
  teamDescription?: string;
  cadLink?: string;
  codeLink?: string;
  specs?: Array<{ label: string; value: string }>;
  achievements?: Array<{ title: string; event: string }>;
}

// All robot data is now stored in the database
// Add robots through the admin panel
export const robotsData: Robot[] = [];
