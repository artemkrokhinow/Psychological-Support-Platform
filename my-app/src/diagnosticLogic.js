import SosView from "./pages/sosPage/variants/SosView";
import BlueView from "./pages/sosPage/variants/BlueView";
const resultsMap = {

    "emergency":  SosView,

    "1": SosView,
    "2": BlueView,
    "3": BlueView,

    "1,1":  SosView,
    "1,2":  SosView,
    "1,3": SosView,
    
    "2,1": BlueView,
    "2,2": BlueView,
    "2,3": BlueView,

    "3,1": BlueView,
    "3,2": BlueView,
    "3,3": BlueView,

    "1,1,1":  SosView,
    "1,1,2":  SosView,
    "1,1,3":  SosView,
    "1,2,1":  SosView,
    "1,2,2":  SosView,
    "1,2,3":  SosView,
    "1,3,1": SosView,
    "1,3,2": SosView,
    "1,3,3": SosView,

    "2,1,1": BlueView,
    "2,1,2": BlueView,
    "2,1,3": BlueView,
    "2,2,1": BlueView,
    "2,2,2": BlueView,
    "2,2,3": BlueView,
    "2,3,1": BlueView,
    "2,3,2": BlueView,
    "2,3,3": BlueView,

    "3,1,1": BlueView,
    "3,1,2": BlueView,
    "3,1,3": BlueView,
    "3,2,1": BlueView,
    "3,2,2": BlueView,
    "3,2,3": BlueView,
    "3,3,1": BlueView,
    "3,3,2": BlueView,
    "3,3,3": BlueView,
};

export const getDiagnosticResult = (answers) => {
    console.log("Getting diagnostic result for answers:", answers);
    if (!answers || answers.length === 0) return resultsMap["emergency"];
    const result = resultsMap[answers] 
    console.log("Diagnostic result for answers", answers, "is", result);
    return result
};