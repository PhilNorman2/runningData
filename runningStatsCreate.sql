SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[runningStats-rds]
    @startDate DATE,
    @endDate DATE,
    @activity NVARCHAR(50)
AS
    if (@activity = 'running')
    BEGIN 
        SELECT cast(cast(cast(avg(cast(CAST(Avg_Pace as datetime) as float)) as datetime) as time) as varchar(5)) as AvgPace, MAX(Max_HR) as Max_HR, CAST(MIN(Avg_Pace) as NVARCHAR(5)) as MinPace, MAX(Distance) as MaxDistance, ROUND(AVG(Distance),1) as AvgDistance, AVG(Calories) AS AvgCalories, ROUND(SUM(Distance),0) as SumDistance 
        FROM Activities4 where date >= @startDate AND date <= @endDate AND Activity = @activity;
    END 
    if (@activity = 'cycling')
    BEGIN        
        SELECT ROUND(AVG(cast(RIGHT(cast(Avg_Pace as nvarchar(5)), 4)as float)),1) as Avg_MPH, MAX(Max_HR) as Max_HR, RIGHT(MAX(Avg_Pace), 4) as Max_MPH, MAX(Distance) as MaxDistance, ROUND(AVG(Distance),1) as AvgDistance, AVG(Calories) AS AvgCalories, ROUND(SUM(Distance),0) as SumDistance
        FROM Activities4 where date >= @startDate AND date <= @endDate AND Activity = @activity;
    END












GO
