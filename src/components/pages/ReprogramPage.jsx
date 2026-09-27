import { Container, Stack } from "@mui/material";
import { ReprogramGuidedTour } from "../group-tours/reservationsComponents/GuidedTourReprogram";

export default function ReprogramPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <ReprogramGuidedTour />
      </Stack>
    </Container>
  );
}
