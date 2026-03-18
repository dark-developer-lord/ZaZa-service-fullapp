import FoodHero from "../components/food/FoodHero"
import FoodFeatures from "../components/food/FoodFeatures"
import FoodRestaurants from "../components/food/FoodRestaurants"
import FoodHowItWorks from "../components/food/FoodHowItWorks"
import FoodBenefits from "../components/food/FoodBenefits"
import FoodCTA from "../components/food/FoodCTA"
import FoodDownload from "../components/food/FoodDownload"

const FoodPage = () => {
  return (
    <div className="flex flex-col">
      <FoodHero />
      <FoodFeatures />
      <FoodRestaurants />
      <FoodHowItWorks />
      <FoodBenefits />
      <FoodCTA />
      <FoodDownload />
    </div>
  )
}

export default FoodPage

