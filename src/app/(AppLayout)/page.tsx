'use client'
import PageContainer from "./components/container/PageContainer";
import SwaggerGenPage from "./util/swagger_gen/page";

const Principal = () => {
  return (
    <PageContainer title="" description="">
      <SwaggerGenPage></SwaggerGenPage>
    </PageContainer>
  )
}

export default Principal;
