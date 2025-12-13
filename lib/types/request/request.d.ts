import { Meta } from "../base";

interface RequestProps {
  product_requests: {
    id: string;
    name: string;
  }[];
  regions: {
    id: string;
    region_name: string;
  }[];
}

export type RequestResponse = {
  meta: Meta;
  data: RequestProps;
};
