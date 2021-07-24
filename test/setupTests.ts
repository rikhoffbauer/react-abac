import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import enzyme from "enzyme";

enzyme.configure({ adapter: new Adapter() });
