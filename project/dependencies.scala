import sbt._

object dependencies {
  val scalatestplusplay = "org.scalatestplus.play" %% "scalatestplus-play" % versionNumber.scalatestplusplay % Test
}

object versionNumber {
  val scalatestplusplay = "5.1.0"
}