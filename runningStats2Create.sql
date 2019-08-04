SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[runningStats2]
    @startDate DATE,
    @endDate DATE
AS
    SELECT cast(cast(cast(avg(cast(CAST(Avg_Pace as datetime) as float)) as datetime) as time) as varchar(5)) as AvgPace, MAX(Max_HR) as Max_HR, CAST(MIN(Avg_Pace) as NVARCHAR(5)) as MinPace, MAX(Distance) as MaxDistance, ROUND(AVG(Distance),1) as AvgDistance, AVG(Calories) AS AvgCalories 
    FROM Activities2 where date >= @startDate AND date <= @endDate;



GO
