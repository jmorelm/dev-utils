'use client'

import { Box } from "@mui/material";
import PageContainer from "./components/container/PageContainer";
import SwaggerGenPage from "./util/swagger_gen/page";

const Dashboard = () => {
  return (
    <PageContainer title="" description="this is Dashboard">
      <SwaggerGenPage></SwaggerGenPage>
    </PageContainer>
  )
}

export default Dashboard;
