name := """Malefiz in Scala for WebApps"""

version := "1.0-SNAPSHOT"

scalaVersion := "2.13.10"

/** Dependencies */
lazy val commonDependencies = Seq(
  dependencies.scalatestplusplay,
  guice
)

/** Common Settings */
lazy val commonSettings = Seq(
  organization := "de.htwg.se"
)

/** Project root */
lazy val root = project
  .in(file("."))
  .settings(
    commonSettings,
    libraryDependencies ++= commonDependencies,
  )
  .enablePlugins(PlayScala).enablePlugins(SbtWeb)

includeFilter in (Assets, LessKeys.less) := "*.less"
excludeFilter in (Assets, LessKeys.less) := "_*.less"

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.htwg.se.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.se.binders._"
