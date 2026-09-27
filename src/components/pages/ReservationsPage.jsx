import React from "react";
import ReservationsList from "../group-tours/reservationsComponents/TableGuidedTours";
import SelfGuidedReservationsList from "../group-tours/reservationsComponents/TableSelf-GuidedTours";
import { Container, Stack, Box, Typography, Button } from "@mui/material";

export const ReservationsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <ReservationsList />
      <SelfGuidedReservationsList />
    </Container>
  );
};
